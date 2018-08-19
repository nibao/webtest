numbers='1 2 3 4 5 6 7'
print "we will creat 10 numbers"
stuff=numbers.split(' ')

more_stuff=['8','9','10','11','12']

while len(stuff)!=10:
    next=more_stuff.pop()
    stuff.append(next)

print stuff
print more_stuff
